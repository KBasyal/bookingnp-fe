const LoginPage = () => {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg">
                    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                        Sign in to your account
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                        Please enter your credentials to log in.
                    </p>

                    <form action="#" className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow-lg">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                className="w-full rounded-md border-gray-200 bg-gray-100 p-4 text-sm shadow-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className="w-full rounded-md border-gray-200 bg-gray-100 p-4 text-sm shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="block w-full rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                        >
                            Log In
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            No account?
                            <a className="underline" href="#">Sign up</a>.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default LoginPage;
