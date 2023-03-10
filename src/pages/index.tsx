import Login from 'pages/Login';

function App(): JSX.Element {
  // useEffect(() => {
  //   axios({
  //     url: 'https://sandbox.101digital.io/token',
  //     method: 'POST',
  //     params: {
  //       client_id: 'oO8BMTesSg9Vl3_jAyKpbOd2fIEa',
  //       client_secret: '0Exp4dwqmpON_ezyhfm0o_Xkowka',
  //       grant_type: 'password',
  //       scope: 'openid',
  //       username: 'dung+octopus4@101digital.io',
  //       password: 'Abc@123456'
  //     }
  //   }).then((res) => {
  //     console.log('call api success');
  //     console.log(res);
  //   });
  // }, []);

  return <Login />;
}

export default App;
