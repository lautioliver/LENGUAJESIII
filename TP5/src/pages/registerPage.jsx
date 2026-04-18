import React, { useState } from "react";


export const RegisterPage = () => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        password: "",
        confirmPassword: "",
        institution: "",
        role: "student",
        acceptTerms: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        return strength;
    };

    const getPasswordStrengthLabel = () => {
        if (passwordStrength === 0) return "";
        if (passwordStrength === 1) return "Débil";
        if (passwordStrength <= 2) return "Media";
        return "Fuerte";
    };

    const getPasswordStrengthClass = () => {
        if (passwordStrength === 0) return "";
        if (passwordStrength === 1) return "weak";
        if (passwordStrength <= 2) return "medium";
        return "strong";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({ ...prev, [name]: newValue }));

        if (name === "password") {
            setPasswordStrength(checkPasswordStrength(value));
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido";
        if (!formData.lastName.trim()) newErrors.lastName = "El apellido es requerido";
        if (!formData.email.trim()) {
            newErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@ucasal\.edu\.ar$/.test(formData.email)) {
            newErrors.email = "Email inválido, debe ser @ucasal.edu.ar";
        }
        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (formData.password.length < 8) {
            newErrors.password = "Mínimo 8 caracteres";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = "Debes aceptar los términos";
        }
        if (!formData.birthDate) {
            newErrors.birthDate = "La fecha de nacimiento es requerida";
        }
        if (formData.birthDate > "2006-01-01" || formData.birthDate < "1985-01-01") {
            newErrors.birthDate = "Debes ser mayor de 18 años o menor de 40";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setLoading(true);
        try {
            // Simular envío del formulario
            await new Promise((resolve) => setTimeout(resolve, 1500));
            alert("¡Cuenta creada con éxito!");
            setFormData({
                firstName: "", lastName: "", birthDate: "", email: "",
                password: "", confirmPassword: "", institution: "",
                role: "student", acceptTerms: false,
            });
            setPasswordStrength(0);
            setErrors({});
        } catch (err) {
            setErrors({ general: "Ocurrió un error. Intentá de nuevo." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="register fade-up">
                <div className="register-header">
                    <div className="register-eyebrow">LENGUAJES III</div>
                    <h1 className="register-title">Crear <em>cuenta</em></h1>
                </div>

                {/* STATUS MESSAGE */}
                {errors.general && (
                    <div className="status-message error">
                        <span className="status-message-icon">✕</span>
                        {errors.general}
                    </div>
                )}

                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className={`form-container ${loading ? "loading" : ""}`}>

                    {/* DATOS PERSONALES */}
                    <div className="form-section">
                        <div className="form-section-title">Datos Personales</div>
                        <div className="form-row">
                            <div className="form-field">
                                <label className="form-label">Nombre</label>
                                <input type="text" name="firstName" className="form-input" placeholder="Juan" value={formData.firstName} onChange={handleChange} />
                                {errors.firstName && <div className="form-hint error">{errors.firstName}</div>}
                            </div>
                            <div className="form-field">
                                <label className="form-label">Apellido</label>
                                <input type="text" name="lastName" className="form-input" placeholder="Pérez" value={formData.lastName} onChange={handleChange} />
                                {errors.lastName && <div className="form-hint error">{errors.lastName}</div>}
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="form-field">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" className="form-input" placeholder="juan@example.com" value={formData.email} onChange={handleChange} />
                            {errors.email && <div className="form-hint error">{errors.email}</div>}
                        </div>

                        {/* FECHA DE NACIMIENTO */}
                        <div className="form-field">
                            <label className="form-label">Fecha de nacimiento</label>
                            <input type="date" name="birthDate" className="form-input" value={formData.birthDate} onChange={handleChange} />
                            {errors.birthDate && <div className="form-hint error">{errors.birthDate}</div>}
                        </div>
                    </div>

                    {/* INSTITUCION
                    <div className="form-section">
                        <div className="form-section-title">Institución</div>
                        <div className="form-field">
                            <label className="form-label">Universidad / Institución</label>
                            <input type="text" name="institution" className="form-input" placeholder="Ej: UCASAL" value={formData.institution} onChange={handleChange} />
                        </div>
                        <div className="form-field">
                            <label className="form-label">¿Cuál es tu rol?</label>
                            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                                <option value="student">Estudiante</option>
                                <option value="teacher">Docente</option>
                                <option value="professional">Profesional</option>
                            </select>
                        </div>
                    </div>
                    */}

                    {/* SEGURIDAD */}
                    <div className="form-section">
                        <div className="form-section-title">Seguridad</div>
                        <div className="form-field">
                            <label className="form-label">Contraseña</label>
                            <input type="password" name="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                            {formData.password && (
                                <>
                                    <div className="password-strength">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className={`strength-bar ${i <= passwordStrength ? getPasswordStrengthClass() : ""}`} />
                                        ))}
                                    </div>
                                    <div className={`password-strength-label ${getPasswordStrengthClass()}`}>
                                        Fortaleza: {getPasswordStrengthLabel()}
                                    </div>
                                </>
                            )}
                            {errors.password && <div className="form-hint error">{errors.password}</div>}
                        </div>
                        <div className="form-field">
                            <label className="form-label">Confirmar Contraseña</label>
                            <input type="password" name="confirmPassword" className="form-input" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                            {errors.confirmPassword && <div className="form-hint error">{errors.confirmPassword}</div>}
                        </div>
                    </div>

                    {/* CHECKBOX */}
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input type="checkbox" id="acceptTerms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
                            <label htmlFor="acceptTerms">
                                Acepto los <span onClick={() => setShowTermsModal(true)} style={{ color: "var(--teal)", cursor: "pointer", textDecoration: "underline" }}>términos y condiciones</span>
                            </label>
                        </div>
                        {errors.acceptTerms && <div className="form-hint error">{errors.acceptTerms}</div>}
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? <span className="spinner"></span> : "Crear Cuenta"}
                    </button>

                    <div className="form-footer">
                        <span>¿Ya tenés cuenta?</span>
                        <a href="#">Inicia sesión</a>
                    </div>
                </form>
            </div>

            {/* MODAL DE TÉRMINOS Y CONDICIONES */}
            {showTermsModal && (
                <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Términos y Condiciones</h3>
                            <button
                                onClick={() => setShowTermsModal(false)}
                                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--muted)" }}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <h4>1. Aceptación de los términos</h4>
                            <p>*Prueba para ver como se ven*</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-submit" onClick={() => { setFormData(prev => ({ ...prev, acceptTerms: true })); setShowTermsModal(false); }}>
                                Aceptar y cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisterPage;