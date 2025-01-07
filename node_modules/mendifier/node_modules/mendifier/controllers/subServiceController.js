const subProvider= require('../models/Providersub');

exports.insertsubServices= async(req,res)=>
{
    try {
        const { providerId, name, description } = req.body;
        const subprovider = await subProvider.findByname({name});
        if (!subprovider ) {
            subprovider.providerId=providerId;
            subprovider.name= name;
            subprovider.description= description;

            await subprovider.save();
            res.status(200).json({ message: ' details updated successfully' });
        }
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving details' });
    }
};

exports.getService= async (req,res)=>{
    try {
        const {serviceId}= req.body;
        const subprovider = await subProvider.findByproviderId({serviceId});
        if(!subprovider)
        {
            res.status(404).json({ message: ' Provider not found' });
        }
        res.status(200).json({subprovider});

    } 
    catch (error) 
    {
        console.log(error)
        res.status(500).json({message: 'Error getting users', error});
    }

};