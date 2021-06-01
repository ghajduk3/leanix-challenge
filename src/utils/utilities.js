const cloudinary = require('cloudinary').v2;

function setupCloudinary(){
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
}

async function uploadFile(fileBuffer){
    return new Promise((resolve,reject) => {
        cloudinary.uploader.upload_stream(
            {},
            (error, result) => {
                if(error){
                    reject(error);
                }else{
                    resolve(result.url);
                }
            }
        ).end(fileBuffer);
    });
}

export {setupCloudinary,uploadFile};