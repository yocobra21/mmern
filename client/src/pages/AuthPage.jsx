import React, { useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, request, error, clearError } = useHttp();

    const [form, setForm] = React.useState({
        email: '', password: ''
    });

    React.useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    React.useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', { ...form });
            message(data.message);
        } catch (error) {

        }

    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', { ...form });
            console.log(data);
            auth.login(data.token, data.userId)
        } catch (error) {

        }

    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи ссылку</h1>

                <div className="card grey darken-4">
                    <div className="card-content white-text">
                        <span className="card-title">Auth</span>
                        <div>

                            <div className="input-field">
                                <input placeholder="Введите Email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="validate white-text"
                                    onChange={changeHandler} />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input placeholder="Введите Password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="validate white-text"
                                    onChange={changeHandler} />
                                <label htmlFor="password">Password</label>
                            </div>

                        </div>
                    </div>
                    <div className="card-action ">
                        <button onClick={loginHandler} disabled={loading} className="btn purple lighten-2 white-text" style={{ marginRight: 20 }}>Войти</button>
                        <button onClick={registerHandler} disabled={loading} className="btn cyan lighten-2 white-text">Регистрация</button>
                    </div>
                </div>

            </div>
        </div>
    );
};