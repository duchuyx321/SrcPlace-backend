const fs = require('fs');
const { driver } = require('../config/Driver/configDriver');
const path = require('path');

class DriverService {
    async uploadFileToDriver({
        localPath = '',
        source_ID = '',
        fileName = '',
        mimeType = '',
    } = {}) {
        try {
            const allowedMimes = [
                'application/zip',
                'application/vnd.rar',
                'application/x-7z-compressed',
                'application/x-tar',
                'application/gzip',
            ];
            if (!allowedMimes.includes(mimeType)) {
                const resultDeleteLocal =
                    await this.deleteFileToLocal(localPath);
                if (resultDeleteLocal.status !== 200) {
                    return {
                        status: resultDeleteLocal.status,
                        error: resultDeleteLocal.message,
                    };
                }
                return { status: 403, error: 'File type not allowed' };
            }
            if (source_ID) {
                const deleteFile = await this.deleteFileToDriver(source_ID);
                if (deleteFile.status !== 200) {
                    throw new Error(deleteFile.error);
                }
            }
            const fileStream = fs.createReadStream(localPath);
            const createFile = await driver.files.create({
                requestBody: {
                    name: fileName,
                    mimeType,
                },
                media: {
                    mimeType,
                    body: fileStream,
                },
                fields: 'id,webContentLink',
            });
            const resultDeleteLocal = await this.deleteFileToLocal(localPath);
            if (resultDeleteLocal.status !== 200) {
                return {
                    status: resultDeleteLocal.status,
                    error: resultDeleteLocal.message,
                };
            }
            const data = {
                source_ID: createFile.data.id,
                download_url: createFile.data.webContentLink,
            };
            return { status: 200, data };
        } catch (error) {
            const resultDeleteLocal = await this.deleteFileToLocal(localPath);
            if (resultDeleteLocal.status !== 200) {
                return {
                    status: resultDeleteLocal.status,
                    error: resultDeleteLocal.message,
                };
            }
            console.log(error);
            return { error: error.message, status: 501 };
        }
    }
    async permissionDriverUser({ source_IDs = [], email = '' }) {
        try {
            const permissions = [];
            for (const source_ID of source_IDs) {
                const permission = await driver.permissions.create({
                    fileId: source_ID,
                    requestBody: {
                        type: 'user',
                        role: 'reader',
                        emailAddress: email,
                    },
                });
                permissions.push(permission.data?.id);
            }
            return {
                status: 200,
                message: 'Cấp quyền thành công',
                permissions,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async deletePermissionDriverUser(permissionIds = [], source_IDs = []) {
        try {
            for (let i = 0; i > source_IDs.length; i++) {
                await driver.permissions.delete({
                    fileId: source_IDs[i],
                    permissionId: permissionIds[i],
                });
            }
            return { status: 200, message: 'Thu hồi quyền thành công' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    // get file about local
    async getFileAboutLocal({ source_ID = '', order_ID = '' }) {
        const downloadDir = path.join(__dirname, '..', 'Assets', 'Downloads');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }
        const resultFileDriver = await driver.files.get({
            fileId: source_ID,
            fields: 'name',
        });
        // lấy tên file
        const originalname =
            resultFileDriver.data?.name.split('_')[4] || 'Unknown_File.rar';
        const fileName = `SrcPlace_${order_ID}_${originalname}`;
        const userFriendlyName = `SrcPlace_${originalname}`;
        // tải file về
        const result = await driver.files.get(
            {
                fileId: source_ID,
                alt: 'media',
            },
            {
                responseType: 'stream',
            },
        );
        const filePath = path.join(downloadDir, fileName);
        const dest = fs.createWriteStream(filePath);
        let totalBytes = 0;

        await new Promise((resolve, reject) => {
            result.data
                .on('data', (chunk) => {
                    totalBytes += chunk.length;
                })
                .on('error', (err) => {
                    reject(new Error('Stream Error: ' + err.message));
                })
                .pipe(dest);

            dest.on('finish', () => {
                if (totalBytes === 0) {
                    reject(new Error('Tải thành công nhưng file rỗng!'));
                } else {
                    resolve();
                }
            });

            dest.on('error', (err) => {
                reject(new Error('Write File Error: ' + err.message));
            });
        });
        return { filePath, userFriendlyName };
    }
    async deleteFileToDriver(source_ID) {
        try {
            const deleteFile = await driver.files.delete({
                fileId: source_ID,
            });
            if (deleteFile.status !== 204) {
                return { status: deleteFile.status, error: 'delete is false!' };
            }
            return { status: 200, error: 'delete is successful!' };
        } catch (error) {
            console.log(error);
            return { status: 501, error: error.message };
        }
    }

    async deleteFileToLocal(pathLocal) {
        try {
            await fs.promises.unlink(pathLocal);
            return { status: 200, message: 'Xóa file thành công' };
        } catch (error) {
            console.log(error);
            return { status: 500, message: error.message };
        }
    }
}

module.exports = new DriverService();
