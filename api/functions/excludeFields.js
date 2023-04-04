module.exports.excludeFields = (model, fields) => {
    fields.map(field => {
        delete (model[field])
    })
    return model;
}