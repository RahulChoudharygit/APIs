const contactModel = require('../modules/contactModel')
const userModel = require('../modules/userModel')
const helper = require('../utils/helper');


module.exports.contactControl = async (req, res) => {
    try {
        const { name, mobile, email, discription } = req.body;
        const from  = 919982611049;

        if (!name) {
            res.status(404).send({ success: false, message: 'please enter valid first name.' });
            return false;
        };
        if (!mobile) {
            res.status(404).send({ success: false, message: 'please enter mobile number.' });
            return false;
        };
        if (!email) {
            res.status(404).send({ success: false, message: 'please enter E-Mail Id.' });
            return false;
        };
        if (!discription) {
            res.status(404).send({ success: false, message: 'please enter your problems and goodness description box.' });
            return false;
        };

        //Validation of email ::

        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };
        if (!validateEmail(email)) {
            res.status(404).send({ success: false, message: 'Please Enter Valid Email.' });
            return false;
        };
        //Validation of mobile number :>

        // if (!(mobile.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(mobile.match(/0{5,}/)))) {
        //     res.status(404).send({ success: false, message: 'Please Enter Valid Mobile number.' });
        //     return false;
        // };

        const existEmail = await userModel.findOne({ email })
        if (existEmail) {

            const setContact = contactModel({
                name : await helper.capitalizeName(name),
                email,
                mobile,
                discription
            })
            const contactedDone = await setContact.save()
            // const msg = `Contact details submitted successfully. For more Enquiry visit our details section.We solve your problems within 24hours.`;

            // const sendMessage = await helper.sendSMS(mobile,from,msg);

            res.status(201).json({ success: true, message: 'Contact details submitted successfully. For more Enquiry visit our details section.We solve your problems within 24hours.', contactedDone });
        } else {
            res.status(404).send({ success: false, message: `OOPS! ${name}, You  are not Registered yet. Please register firstly.` });
        };

    } catch (error) {
        res.status(404).send({ success: false, message: error });
        console.log("Error from contactControl function : ", error);
    }
};