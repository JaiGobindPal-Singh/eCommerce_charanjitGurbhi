import PaymentOptions from "../models/paymentOptions.model.js";

export const initializePaymentOptions = async () => {
    await PaymentOptions.findByIdAndUpdate(
        "payment-options",
        {},
        {
            upsert: true,
            setDefaultsOnInsert: true
        }
    );
}
export const getPaymentMethods = async (req, res) => {
    try {

        //fetch Payment options from db
        const paymentOptions = await PaymentOptions.findOne().lean();
        if (!paymentOptions) {
            return res.status(404).json({
                error: "no payment option available"
            })
        }

        return res.status(200).json({
            paymentOptions: {
                online: paymentOptions.online,
                cod: paymentOptions.cod
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: "internal server error"
        })
    }
}
export const updatePaymentMethod = async (req, res) => {
    try {
        const { online, cod, allowedPostalCodes = [] } = req.body;
        const updatedDoc = {};

        if (online != undefined && online != null) {
            updatedDoc.online = { enabled: online }
        }
        if (cod != undefined && cod != null) {
            updatedDoc['cod.enabled'] = cod
        }
        if (cod && allowedPostalCodes && allowedPostalCodes.length) {
            updatedDoc['cod.allowedPostalCodes'] = allowedPostalCodes;
        }

        //updating db
        const updatedPaymentOption = await PaymentOptions.findByIdAndUpdate(
            "payment-options",
            { $set: updatedDoc },
            {
                returnDocument: 'after',
            }
        ).lean();
        if (!updatedPaymentOption) {
            return res.status(400).json({ error: "invalid payment option" });
        }
        return res.status(200).json({ paymentOptions: updatedPaymentOption });

    } catch (e) {
        return res.status(500).json({ error: "internal server error", e });
    }
}

