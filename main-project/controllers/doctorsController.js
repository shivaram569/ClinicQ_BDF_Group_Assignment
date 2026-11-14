const { dbAsync } = require('../config/db');

// GET /doctors - Retrieve all doctors
const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await dbAsync.all('SELECT * FROM doctors ORDER BY id ASC');
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (err) {
        next(err);
    }
};

// GET /doctors/:id - Retrieve doctor by ID
const getDoctorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const doctor = await dbAsync.get('SELECT * FROM doctors WHERE id = ?', [id]);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: `Doctor with ID ${id} not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (err) {
        next(err);
    }
};

// POST /doctors - Create a new doctor
const createDoctor = async (req, res, next) => {
    try {
        const { name, specialization, phone } = req.body;
        const result = await dbAsync.run(
            'INSERT INTO doctors (name, specialization, phone) VALUES (?, ?, ?)',
            [name.trim(), specialization.trim(), phone.trim()]
        );

        const newDoctor = await dbAsync.get('SELECT * FROM doctors WHERE id = ?', [result.lastID]);

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully.',
            data: newDoctor
        });
    } catch (err) {
        next(err);
    }
};

// PUT /doctors/:id - Update an existing doctor
const updateDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, specialization, phone } = req.body;

        const existing = await dbAsync.get('SELECT * FROM doctors WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Doctor with ID ${id} not found.`
            });
        }

        await dbAsync.run(
            'UPDATE doctors SET name = ?, specialization = ?, phone = ? WHERE id = ?',
            [name.trim(), specialization.trim(), phone.trim(), id]
        );

        const updatedDoctor = await dbAsync.get('SELECT * FROM doctors WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully.',
            data: updatedDoctor
        });
    } catch (err) {
        next(err);
    }
};

// DELETE /doctors/:id - Delete a doctor
const deleteDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await dbAsync.get('SELECT * FROM doctors WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Doctor with ID ${id} not found.`
            });
        }

        await dbAsync.run('DELETE FROM doctors WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: `Doctor with ID ${id} deleted successfully.`
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
