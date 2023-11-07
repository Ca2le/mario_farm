enum SortDirection {
    lowToHigh = 1,
    highToLow = -1
}

export class APIFeatures {
    constructor(public queryDocument: any, public queryString: any) {

    }
    filter() {
        let query = { ...this.queryString }
        const excludeFieldsFromQuery = ["sort", "page", "limit", "fields"]
        excludeFieldsFromQuery.forEach(field => delete query[field])

        let stringifiedQuery = JSON.stringify(query)

        stringifiedQuery = stringifiedQuery.replace(/\b(all|gte|gt|lte|lt|in)\b/g, match => `$${match}`)

        query = JSON.parse(stringifiedQuery)
        console.log("🐮🐮:", query)
        this.queryDocument.find(query)

        return this
    }

    sort() {

        if (this.queryString.sort) {
            const query = this.queryString.sort.split(',')

            const sortQueries: Record<string, number> = {}
            query.forEach((key: string) => sortQueries[key] = SortDirection.highToLow)
            this.queryDocument.sort(sortQueries)
        }

        return this
    }
    fields() {
        console.log("🦖:", this.queryString.fields)
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.queryDocument.select(fields)
            
        }

        return this
    }
    paginate() {
        if (this.queryString.page || this.queryString.limit) {
            const page = this.queryString.page ? 1 * this.queryString.page : 1
            const limit = this.queryString.limit ? 1 * this.queryString.limit : 3
            const skip = (page - 1) * limit as number
            this.queryDocument.skip(skip).limit(limit)

        }

        return this
    }
}