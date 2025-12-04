import User from '../model/userSchema.js'
import { Webhook } from 'svix'

const ClerkWebhooks = async(req, res)=>{
    try{
        //Create a Svix instance with clerk web hook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Getting Header
        const headers = {
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        //Verifying Header
        await whook.verify(JSON.stringify(req.body), headers)

        //Getting data from req body
        const {data, type} = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        }


        //Switch cases for different events
        switch (type) {
            case "user.created":{
                await User.create(userData)
                break;
            }
            case "user.updated":{
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                break;
            }        
            default:
                break;
        }
        res.json({success: true, message: "Webhook Received"})

    } catch(error){
        console.log(error.message);
        res.json({success: failure, message: error.message})
        

    }

}

export default ClerkWebhooks
