import React from "react";

export const RegisterPage = () => {

    return (
        <>
            <div className="register fade-up">
                <div className="register-header">
                    <div className="register-eyebrow">LENGUAEJES III</div>
                    <h1 className="register-title">Crear <em>cuenta</em></h1>
                    <p className="register-subtitle">Disfruta de una experiencia distinta para aprender.</p>
                </div>

                <form>
                    <div className="form-section">
                        <div className="form-section-title">Datos Personales</div>
                        <div className="form-row">
                            <div className="form-field">
                                <label className="form-label">Nombre</label>
                                <input type="text" name="firstName" className="form-input" placeholder="Juan" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Apellido</label>
                                <input type="text" name="lastName" className="form-input" placeholder="Pérez" />
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" className="form-input" placeholder="juan@example.com" />
                            <label className="form-label">Fecha de nacimiento</label>
                            <input type="date" name="birthDate" className="form-input" />
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Institución</div>
                        <div className="form-field">
                            <label className="form-label">Universidad / Institución</label>
                            <input type="text" name="institution" className="form-input" placeholder="Ej: UCASAL" />
                        </div>
                        <div className="form-field">
                            <label className="form-label">¿Cuál es tu rol?</label>
                            <select name="role" className="form-select">
                                <option value="student">Estudiante</option>
                                <option value="teacher">Docente</option>
                                <option value="professional">Profesional</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">Seguridad</div>
                        <div className="form-field">
                            <label className="form-label">Contraseña</label>
                            <input type="password" name="password" className="form-input" placeholder="••••••••" />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Confirmar Contraseña</label>
                            <input type="password" name="confirmPassword" className="form-input" placeholder="••••••••" />
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input type="checkbox" id="acceptTerms" name="acceptTerms" />
                            <label htmlFor="acceptTerms">
                                Acepto los <span style={{ color: "var(--teal)", cursor: "pointer", textDecoration: "underline" }}>términos y condiciones</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit">
                        Crear Cuenta
                    </button>

                    <div className="form-footer">
                        <span>¿Ya tenés cuenta?</span>
                        <a href="/login">Inicia sesión</a>
                    </div>
                </form>
            </div>
        </>
    );
};

export default RegisterPage;