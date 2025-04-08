"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyModule = void 0;
const common_1 = require("@nestjs/common");
const survey_service_1 = require("./survey.service");
const survey_controller_1 = require("./survey.controller");
const mongoose_1 = require("@nestjs/mongoose");
const survey_schema_1 = require("./schemas/survey.schema");
let SurveyModule = class SurveyModule {
};
exports.SurveyModule = SurveyModule;
exports.SurveyModule = SurveyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: survey_schema_1.Survey.name, schema: survey_schema_1.SurveySchema }]),
        ],
        controllers: [survey_controller_1.SurveyController],
        providers: [survey_service_1.SurveyService],
    })
], SurveyModule);
//# sourceMappingURL=survey.module.js.map