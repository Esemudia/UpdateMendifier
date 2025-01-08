const SubProvider= require('../models/Providersub');



exports.insertsubServices = async (req, res) => {
    try {
      const { providerId, name, description } = req.body;
  
      // Check if the subProvider exists
      let subProvider = await SubProvider.findOne({ name });
  
      if (!subProvider) {
        // If subProvider does not exist, create a new one
        subProvider = new SubProvider({
          providerId,
          name,
          description,
        });
  
        await subProvider.save();
        return res.status(201).json({
          message: 'Sub-provider created successfully',
          data: subProvider,
        });
      }
      subProvider.providerId = providerId;
      subProvider.description = description;
  
      await subProvider.save();
      res.status(200).json({
        message: 'Sub-provider updated successfully',
        data: subProvider,
      });
    } catch (error) {
      console.error('Error saving details:', error);
      res.status(500).json({ error: 'Error saving details' });
    }
  };
  




  
  exports.getService = async (req, res) => {
    try {
      const { serviceId } = req.body;
  
      // Ensure serviceId is valid
      if (!serviceId || serviceId.length !== 24) {
        return res.status(400).json({ message: 'Invalid serviceId format' });
      }
  
      // Find subprovider by _id
      const subprovider = await SubProvider.find({providerId:{$eq:serviceId}});
  
      if (!subprovider) {
        return res.status(404).json({ message: 'Provider not found' });
      }
  
      res.status(200).json({ subprovider });
    } catch (error) {
      console.error('Error getting service:', error);
      res.status(500).json({ message: 'Error getting users', error });
    }
  };
  