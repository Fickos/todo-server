const axios = require('axios');
const express = require('express');
const router = express.Router();

const controller = require('../controllers/task.controller');

const convertLocationMiddleware = async (req, res, next) => {
    try {
        const { Location } = req?.body;
        
        if (Location && Location.lat && Location.lng) {
            const { lat, lng } = Location;
            const nominatimResp = 
                await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);

            const { city, country } = nominatimResp.data?.address;
            
            delete req?.body?.Location;

            if (city && country) {
                req.body.Location = `${city}, ${country}`;
            } else if (country) {
                req.body.Location = country;
            } else {
                req.body.Location = 'Unknown';
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: 'couldnt_extract_location' });
    }
    next();
}

router.all('/list/:id', controller.createOrReturnExistingList);
router.get('/:listId', controller.getTasks);
router.post('/:listId', convertLocationMiddleware, controller.saveTask);
router.put('/:listId/task/:id', controller.updateTask);
router.delete('/:listId/task/:id', controller.deleteTask);

module.exports = router;
