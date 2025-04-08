"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const survey_schema_1 = require("../survey/schemas/survey.schema");
let AdminService = class AdminService {
    constructor(surveyModel) {
        this.surveyModel = surveyModel;
    }
    findAll() {
        return this.surveyModel.find().sort({ createdAt: -1 });
    }
    async export(format) {
        const surveys = await this.surveyModel.find();
        if (format === 'json')
            return surveys;
        const csv = ["userId,response,createdAt"].concat(surveys.map(s => `${s.userId},"${s.response.replace(/"/g, '""')}",${s.createdAt.toISOString()}`)).join("\n");
        return csv;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(survey_schema_1.Survey.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map