import { v4 as uuid } from 'uuid'

export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    if ( !file ) return callback( new Error('File is empty'), false );

    const fileExtension = file.mimetype == 'application/x-pkcs12'
                                            ? 'p12'
                                            : file.mimetype.split('/')[1];


    const fileName = `${ file.mimetype !== 'application/x-pkcs12'
                    ? uuid() + '.' + fileExtension
                    : file.originalname
                }`;
    file.originalname = fileName;

    callback(null, fileName );

}