const courseLogic = require('../../app/course');

jest.mock("../../app/course.js");

const { Create } = require('../../controller/course.controller');

describe("course create testing", () => {
    let req, res, next;
    
    beforeEach(() => {
        req = {
            body: {
                CourseName: 'Test Course',
                CourseDescription: 'Test Description',
                Price: 100
            },
            user: {
                Id: 1
            },
            file: {
                filename: 'testfilename.jpg'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });

    test("should create successfully", async () => {
        courseLogic.findByName.mockResolvedValue(null);
        courseLogic.create.mockResolvedValue(1);
        courseLogic.UploadBanner.mockResolvedValue(2);

        await Create(req, res, next);

        expect(courseLogic.findByName).toHaveBeenCalledWith(req.body.CourseName);
        expect(courseLogic.create).toHaveBeenCalledWith(
            req.user.Id,
            req.body.CourseName,
            req.body.CourseDescription,
            req.body.Price
        );
        expect(courseLogic.UploadBanner).toHaveBeenCalledWith(
            `http://localhost:3000/public/upload/${req.file.filename}`,
            req.file.filename,
            1
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            error: null,
            data: {
                message: "Course created",
                id: 1
            }
        });
        expect(next).not.toHaveBeenCalled();
    });
});
