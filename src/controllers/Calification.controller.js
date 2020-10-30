let _calificationService = null;

class CalificationController {
  constructor({ CalificationService }) {
    _calificationService = CalificationService;
  }
  async get(req, res) {
    const { calificationId } = req.params;
    const calification = await _calificationService.get(calificationId);
    return res.send(calification);
  }
  async getAll(req, res) {
    const califications = await _calificationService.getAll();
    return res.send(califications);
  }
  async update(req, res) {
    const { body } = req;
    const { calificationId } = req.params;
    const updateCalification = await _calificationService.update(
      calificationId,
      body,
    );
    return res.send(updateCalification);
  }
  async delete(req, res) {
    const { calificationId } = req.params;
    const deletedCalification = await _calificationService.delete(
      calificationId,
    );
    return res.send(deletedCalification);
  }
  async create(req, res) {
    const { body } = req;
    const createCalification = await _calificationService.create(body);
    return res.status(201).send(createCalification);
  }
}

module.exports = CalificationController;
