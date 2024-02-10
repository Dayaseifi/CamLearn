const courseLogic = require('../../app/course');
const { GetUserByRefreshToken } = require("../../app/user.app");
jest.mock("../../app/course.js");
jest.mock("../../app/user.app.js");

const { Create, getCourse } = require('../../controller/course.controller');

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


describe("Get course testing", () => {
    let req, res, next, course, user, testFiles;
    beforeEach(() => {
        req = {
            params: {
                id: 1
            },
            cookies: {
                jwt: "This is test jwt for testing"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
        course = {
            ID: 1,
            Price: "2000",
            Teacher_ID: 1,
            Files: [{
                src: "test files src",
                isBanner: 0
            }]
        }
        testFiles = [{
            src: "test banner src",
            isBanner: 1
        }, {
            src: "test files src",
            isBanner: 0
        }]
        user = {
            Id: 1
        }
    })
    test("return course successfully", async () => {
        courseLogic.findByID.mockResolvedValue(course)
        courseLogic.Files.mockResolvedValue(testFiles)
        GetUserByRefreshToken.mockResolvedValue(user)
        courseLogic.checkStudent.mockResolvedValue(true)
        await getCourse(req, res, next)
        expect(courseLogic.findByID).toHaveBeenCalledWith(course.ID)
        expect(courseLogic.Files).toHaveBeenCalledWith(course.ID)
        expect(GetUserByRefreshToken).toHaveBeenCalledWith(req.cookies.jwt)
        expect(courseLogic.checkStudent).toHaveBeenCalledWith(course.ID, user.Id)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                data: expect.any(Object),
                hasPermission: true
            },
            error: null
        })
        expect(next).not.toHaveBeenCalled();
    })
    test("handles error and calls next", async () => {
        const error = new Error("Test error");
        courseLogic.findByID.mockRejectedValue(error);

        await getCourse(req, res, next);

        expect(courseLogic.findByID).toHaveBeenCalledWith(req.params.id);

        expect(res.status).not.toHaveBeenCalled();

        expect(res.json).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith(error);
    });
})

