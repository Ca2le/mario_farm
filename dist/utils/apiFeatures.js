"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIFeatures = void 0;
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["lowToHigh"] = 1] = "lowToHigh";
    SortDirection[SortDirection["highToLow"] = -1] = "highToLow";
})(SortDirection || (SortDirection = {}));
class APIFeatures {
    constructor(queryObj, queryString) {
        this.queryObj = queryObj;
        this.queryString = queryString;
    }
    filter() {
        let query = Object.assign({}, this.queryString);
        const excludeFieldsFromQuery = ["sort", "page", "limit", "fields"];
        excludeFieldsFromQuery.forEach(field => delete query[field]);
        let stringifiedQuery = JSON.stringify(query);
        stringifiedQuery = stringifiedQuery.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);
        query = JSON.parse(stringifiedQuery);
        this.queryObj.find(query);
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const query = this.queryString.sort.split(',');
            const sortQueries = {};
            query.forEach((key) => sortQueries[key] = SortDirection.highToLow);
            this.queryObj.sort(sortQueries);
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const selectQeries = this.queryString.fields.replace(",", " ");
            this.queryObj.select(selectQeries);
        }
        return this;
    }
    paginate() {
        if (this.queryString.page || this.queryString.limit) {
            const page = this.queryString.page ? 1 * this.queryString.page : 1;
            const limit = this.queryString.limit ? 1 * this.queryString.limit : 3;
            const skip = (page - 1) * limit;
            this.queryObj.skip(skip).limit(limit);
        }
        return this;
    }
}
exports.APIFeatures = APIFeatures;
//# sourceMappingURL=apiFeatures.js.map