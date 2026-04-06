export declare class UploadsController {
    upload(file: Express.Multer.File): {
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        url: string;
    };
}
