
const service = require('../service');

module.exports.createOrReturnExistingList = async (req, res, next) => {
    try {
        const paramId = req?.params?.id;
        let findRoom = await service.findOne({ 
            where: { ID: paramId }, 
            include: [
                {
                    EntityName: "Task",
                    as: "Tasks",
                }
            ]
        }, "List");
        if (!findRoom) {
            findRoom = await service.create({ ID: paramId }, "List");
            return res.status(200).send({ message: "success_create_list", ...findRoom?.dataValues });
        }
        return res.status(200).send({ message: "success_load_list", ...findRoom?.dataValues });
    } catch (error) {
        next(error);
    }
}

module.exports.getTasks = async (req, res, next) => { // possibly redundant
    try {
        const paramId = req?.params?.listId;
        let tasks = await service.findOne({
            where: { ListID: paramId },
        }, "Task");
        return res.status(200).send({ message: "success_load_tasks", tasks: tasks ?? [] });

    } catch (error) {
        next(error);
    }
}

module.exports.saveTask = async (req, res, next) => {
    try {
        // TO DO: Extract Location string properly -> NOMINATIM ETC.
        let createdTask = await service.create({
            ...req?.body,
            ListID: req?.params?.listId
        }, "Task");

        return res.status(200).send({ message: "success_save_task", ...createdTask?.dataValues });
    } catch (error) {
        next(error);
    }
}

module.exports.updateTask = async (req, res, next) => {
    try {
        const foundTask = await service.findOne({
            where: { TaskID: req?.params?.id }
        }, "Task");

        if (!foundTask) {
            return res.status(404).send({ message: `Task with id: ${req?.params?.id} not found`});
        }

        await service.update({
            ...req?.body,
            ListID: foundTask.ListID,
        }, { where: { TaskID: req?.params?.id } }, "Task");

        const updatedTask = await service.findOne({
            where: { TaskID: req?.params?.id }
        }, "Task");

        return res.status(200).send({ message: "success_update_task", ...updatedTask?.dataValues });
    } catch (error) {
        next(error);
    }
}

module.exports.deleteTask = async (req, res, next) => {
    try {
        const foundTask = await service.findOne({
            where: { TaskID: req?.params?.id }
        }, "Task");
        if (!foundTask) {
            return res.status(404).send({ message: `Task with id: ${req?.params?.id} not found` });
        }
        await service.destroy({
            where: { TaskID: req?.params?.id }
        }, "Task");
        
        return res.status(200).send({ message: "success_delete_task" });
    } catch (error) {
        next(error);
    }
}

