const categoryModelFile = require('../modules/categoryModel');
const { ObjectId } = require("mongodb");
const helper = require('../utils/helper');

module.exports.addCategories = async (req, res) => {
    try {
        const { category, status } = req.body;

        let image;
        if (req.file) {
            image = req.file.filename;
        } else {
            image = null;
        }

        if (req.userInfo.role != "admin") {
            res.status(404).send({ success: false, message: "You are not authenticted here." })
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }

        if (!category) {
            res.status(200).send({ success: false, message: "Please enter the product's category." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        const catFind = {};
        if (category) {
            catFind.category = new RegExp(category, "i")
        }

        const existCategory = await categoryModelFile.findOne(catFind);
        if (!existCategory) {
            const makeCategoryDoc = categoryModelFile({
                category: category.toUpperCase(),
                image: image,
                status: status
            });

            const saveCategory = await makeCategoryDoc.save();
            res.status(200).send({ success: true, message: category + " Saved Successfully" });
            return false;
        } else {
            res.status(404).send({ success: false, message: "This category is already Exist." });
            return false;
        }
    } catch (error) {
        res.status(404).send({ success: false, error: error.message });
        console.log("Error from addCategories function ", error);
    }
};

module.exports.findCategories = async (req, res) => {

    try {
        const { _id, category, status } = req.query;

        let categoryFind = {};

        if (_id) {
            categoryFind._id = new RegExp(_id, "si");
        }
        if (category) {
            categoryFind.category = new RegExp(category, "i");
        }
        if (status) {
            categoryFind.status = new RegExp(status, "i");
        }
        // categoryFind.status = "Y";

        let limit = process.env.PAGE_LIMIT;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        let existCategory = await categoryModelFile.find(categoryFind, { createdAt: 0, updatedAt: 0, __v: 0 })
            // .populate({ path: "categoryId", select: "name" })
            // .limit(limit)
            // .skip(skip)
            .sort({ _id: -1 });

        let usersCount = await categoryModelFile.find().count();

        if (existCategory.length > 0) {
            const modifiedArray = existCategory.map((element, index) => {
                if (element.image) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.image}`,
                    };
                } else {
                    return element;
                }
            })
            res.status(200).send({ success: true, message: "hey! Here Is Your Founded Categories : ", data: modifiedArray });
            return false;
        } else {
            console.log("else");
            res.status(404).send({ success: false, message: "OOPS!!! No Data Available." });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from findCategories function ", error);
    }
};

module.exports.deleteCategories = async (req, res) => {

    try {
        const { _id } = req.body;

        if (req.userInfo.role != "admin") {
            res.status(404).send({ success: false, message: "You are not authenticted here." })
            return false;
        }

        if (!_id) {
            res.status(200).send({ success: false, message: "Please Provide _id." })
            return false;
        }
        const findCategory = await categoryModelFile.findOne({ _id: new ObjectId(_id) });


        if (findCategory) {

            const deleteCategory = await categoryModelFile.deleteOne({ _id: new ObjectId(_id) });
            if (deleteCategory) {
                filepath = path.join(__dirname, "../public/uploads/") + findCategory.image;
                fs.unlinkSync(filepath);
            }
            res.status(200).send({ success: true, message: "Data has been deleted Successfully", data: deleteUser });
        } else {
            res.status(200).send({ success: true, message: 'Can not found', });
            return false;
        }
    } catch (error) {
        console.log("Error from  deleteCategory function : ", error);
    }
};

module.exports.updateCategories = async (req, res) => {

    try {
        const { category, status, _id } = req.body;

        if (req.userInfo.role != "admin") {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            res.status(404).send({ success: false, message: "You are not authenticted here." })
            return false;
        }

        if (!_id) {
            res.status(200).send({ success: false, message: "Please Provide _id." })
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            return false;
        }


        const findCategory = await categoryModelFile.findOne({ _id: new ObjectId(_id) });
        if (findCategory) {
            var userImage;
            if (req.file) {
                filepath = path.join(__dirname, "../public/uploads/") + findCategory.image;
                fs.unlinkSync(filepath);
                userImage = req.file.filename;
            } else {
                userImage = findCategory.image;
            }
            const updateCategory = await categoryModelFile.updateOne({ _id: new ObjectId(_id) }, { $set: { category: category.toUpperCase(), status, image: userImage, updatedAt: new Date() } });
            const updatedCategory = await categoryModelFile.findOne({ _id: new ObjectId(_id) });
            res.status(200).send({ success: true, message: "Data has been update Successfully", data: updatedCategory });
        }


    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from deleteCategories function : ", error);
    }
};