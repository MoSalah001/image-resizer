"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const resize_1 = __importDefault(require("../routes/api/resize"));
const server_1 = __importDefault(require("../server"));
const app = (0, supertest_1.default)(server_1.default);
const filePath = {
    name: 'image-0',
    path: __dirname + 'routes/api/full-images/image-0.png',
    width: 200,
    height: 200,
    ext: '.png',
};
describe('resize function suite tests', () => {
    it('it should pass a file to sharp resize function', () => {
        expect((0, resize_1.default)(filePath)).toBeTruthy;
    });
    it("this should generate an error. Image can't be found", () => {
        filePath.path = __dirname + 'routes/api/full-images/image-55.png';
        expect((0, resize_1.default)(filePath)).toThrowError;
    });
});
describe('server routes suite tests', () => {
    it('it should serve the image when found-this is correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield app.get('/api/image?image=image-0&width=400&height=400&ext=jpg');
        expect(res.statusCode).toBe(200);
    }));
    it('it should serve the image when found-this should fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield app.get('/api/image?image=image-400&width=200&height=200&ext=png');
        expect(res.statusCode).toBe(404);
    }));
});
