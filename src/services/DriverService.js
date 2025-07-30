const fs = require('fs').promises;
const { driver } = require('../config/Driver/configDriver');

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
            const createFile = await driver.files.create({
                requestBody: {
                    name: `${fileName}`,
                    mimeType,
                },
                media: {
                    mimeType,
                    body: localPath,
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
            await fs.unlink(pathLocal);
            return { status: 200, message: 'Xóa file thành công' };
        } catch (error) {
            console.log(error);
            return { status: 501, message: error.message };
        }
    }
}

module.exports = new DriverService();
