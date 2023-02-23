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
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const busboy_1 = __importDefault(require("busboy"));
const resize_1 = __importDefault(require("./api/resize"));
let fileData;
const routes = express_1.default.Router();
routes.post('/', (req, res) => {
    const apiPath = path_1.default.join(__dirname, `/api/full-images/`);
    if (!fs_1.default.existsSync(apiPath)) {
        fs_1.default.mkdirSync(apiPath, { recursive: true });
    }
    const busboy = (0, busboy_1.default)({ headers: req.headers });
    // "@ts-expect-error"
    busboy.on('file', (fieldname, file, filename) => {
        if (filename.filename) {
            const length = fs_1.default.readdirSync(apiPath).length;
            const index = filename.filename.indexOf('.');
            const ext = filename.filename.slice(index);
            const imageName = `image-${length}`;
            const saveOrg = path_1.default.join(__dirname, `/api/full-images/` + imageName + `${ext}`);
            fileData = {
                path: saveOrg,
                name: imageName,
                width: 0,
                height: 0,
                ext: ext,
            };
            if (!fs_1.default.existsSync(apiPath)) {
                fs_1.default.mkdirSync(apiPath, { recursive: true });
            }
            file.pipe(fs_1.default.createWriteStream(saveOrg));
        }
        else {
            res.status(404).send('No file Recieved Please choose a file');
        }
    });
    busboy.on('field', (name, val) => {
        busboy.on('finish', () => {
            if (name === 'width') {
                fileData.width = parseInt(val);
            }
            else {
                fileData.height = parseInt(val);
            }
        });
    });
    busboy.on('finish', () => {
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, resize_1.default)(fileData);
            setTimeout(() => {
                res
                    .status(301)
                    .send(`\\api\\image?image=${result.name}&width=${result.width}&height=${result.height}&ext=${result.ext.slice(1)}`);
            }, 1000);
        }), 2000);
    });
    return req.pipe(busboy);
});
routes.get('/image', (req, res) => {
    const file = path_1.default.join(__dirname, `/api/thumb/${req.query.image}_${req.query.width}_${req.query.height}.${req.query.ext}`);
    if (fs_1.default.existsSync(file)) {
        res.contentType('image/png');
        res.type('png');
        res.status(200).sendFile(file, {
            maxAge: 36000,
            dotfiles: 'allow',
        });
    }
    else {
        res.status(404).send('File Not Found');
    }
});
exports.default = routes;
