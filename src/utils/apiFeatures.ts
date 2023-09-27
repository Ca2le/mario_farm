enum SortDirection {
    lowToHigh = 1,
    highToLow = -1
}

export class APIFeatures {
    constructor(public queryObj: any, public queryString: any) {

    }
    filter() {
        let query = { ...this.queryString }
        console.log(typeof(this.queryString))
        const excludeFieldsFromQuery = ["sort", "page", "limit", "fields"]
        excludeFieldsFromQuery.forEach(field => delete query[field])
        let stringifiedQuery = JSON.stringify(query)
        stringifiedQuery = stringifiedQuery.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`)
        query = JSON.parse(stringifiedQuery)
        this.queryObj.find(query)
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const query = this.queryString.sort.split(',')
            const sortQueries: Record<string, number> = {}
            query.forEach((key: string) => sortQueries[key] = SortDirection.highToLow)
            this.queryObj.sort(sortQueries)
        }

        return this
    }
    limitFields() {
        if (this.queryString.fields) {
            const selectQeries = this.queryString.fields.replace(",", " ")
            this.queryObj.select(selectQeries)
        }

        return this
    }
    paginate() {
        if (this.queryString.page || this.queryString.limit) {
            const page = this.queryString.page ? 1 * this.queryString.page : 1
            const limit = this.queryString.limit ? 1 * this.queryString.limit : 3
            const skip = (page - 1) * limit as number
            this.queryObj.skip(skip).limit(limit)

        }
        return this
    }
}