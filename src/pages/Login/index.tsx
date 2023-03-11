import { INPUT } from 'constant/style';
import { FieldValues, useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ROUTES, API_URL } from 'constant';

export default function Login(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const { email, password } = data;
  
    try {
      const { access_token, refresh_token } = await fetchAccessToken(email, password);
      const { org_token } = await fetchOrgToken(access_token);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('org_token', org_token);
      localStorage.setItem('refresh_token', refresh_token);
      navigate(ROUTES.INVOICE);
    } catch (error) {
      throw new Error("Error login" + error);
    }
  };

  const fetchAccessToken = async (username: string, password: string): Promise<{ access_token: string; refresh_token: string }> => {
    try {
      const response = await axios({
        url: `${API_URL.baseURL}/token`,
        method: 'POST',
        params: {
          client_id: 'oO8BMTesSg9Vl3_jAyKpbOd2fIEa',
          client_secret: '0Exp4dwqmpON_ezyhfm0o_Xkowka',
          grant_type: 'password',
          scope: 'openid',
          username,
          password,
        },
      });
  
      const { access_token, refresh_token } = response.data;
      return { access_token, refresh_token };
    } catch (error) {
      throw new Error("Error fetching access token: " + error);
    }
  };

  const fetchOrgToken = async (access_token: string): Promise<{ org_token: string}> => {
    try {
      const response = await axios({
        url: `${API_URL.baseURL}/membership-service/1.2.0/users/me`,
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token},
      });

      const { data } = response.data;
    
      return (data.memberships[0].token);
    } catch (error) {
      throw new Error("Error fetching org token: " + error);
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Simple Invoice
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                  type="email"
                  placeholder="Input your email"
                  className={errors.email ? INPUT.ERROR : INPUT.DEFAULT}
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span>This field is required.</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  type="password"
                  placeholder="Input your password"
                  className={errors.password ? INPUT.ERROR : INPUT.DEFAULT}
                  {...register('password', { required: true })}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span>This field is required.</span>
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
