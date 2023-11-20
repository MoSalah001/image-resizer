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
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
function resize(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const destPath = path_1.default.join(__dirname, `thumb`,`${obj.name}-${obj.width}-${obj.height}${obj.ext}`);
        const checkPath = path_1.default.join(__dirname, `thumb`);
        if (!fs_1.default.existsSync(checkPath)) {
            fs_1.default.mkdirSync(checkPath, { recursive: true });
        }
        fs_1.default.readFile(obj.path, (err, data) => {
            if (err) {
                return `Error: ${err}`;
            }
            else {
                const image = (0, sharp_1.default)(data);
                image
                    .resize(obj.width, obj.height, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 },
                })
                    .toFormat(`${obj.ext.slice(1)}`, { mozjpeg: true })
                    .toFile(destPath);
            }
        });
        return obj;
    });
}
exports.default = resize;
