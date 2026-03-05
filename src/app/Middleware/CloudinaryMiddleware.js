const multer = require('multer');
const path = require('path');

const cloudinary = require('../../config/Cloudinary/connectCloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { newCode } = require('../../util/codeUtil');

const newStorage = (type) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: type,
            public_id: async (req, file) => {
                const codeFile = await newCode({ isUpLower: false });
                return `SrcPlace_${Date.now()}_${codeFile}_${file.originalname}`;
            },
        },
    });
    return storage;
};

const uploadCloudinary = ({
    type = 'Avatar', // ["Avatar", "Logo", "Thumbnail"]
} = {}) => {
    const storage = newStorage(type);
    return multer({ storage, limits: { fieldSize: 3 * 1024 * 1024 } });
};
// lưu vào local
const storageLocal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'Assets', 'Sources')); //thư mục để lưu
    },
    filename: async (req, file, cb) => {
        const codeFile = await newCode({ length: 6, isUpLower: false });
        cb(
            null,
            `SrcPlace_SourceCode_${Date.now()}_${codeFile}_${file.originalname}`,
        ); //tên thư mục
    },
});
const uploadLocal = multer({ storage: storageLocal });

module.exports = { uploadCloudinary, uploadLocal };
