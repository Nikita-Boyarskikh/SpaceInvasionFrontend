(function userService() {
  const { Http } = window;

  class UserService {
    constructor() {
      this.user = null;
      this.users = [];
    }

    // Регистрация пользователя
    static register(email, login, password) {
      return Http.Fetch('POST', '/user/signup', { email, login, password });
    }

    // Авторизация пользователя
    static login(login, password) {
      return Http.Fetch('POST', '/user/signin', { login, password });
    }

    // Залогинен ли пользователь
    isLoggedIn() {
      return !!this.user;
    }

    getData(force = false) {
      if (this.isLoggedIn() && !force) {
        return Promise.resolve(this.user);
      }

      return Http.Fetch('GET', '/me')
        .then((userdata) => {
          this.user = userdata;
          return userdata;
        });
    }
  }

  window.UserService = UserService;
}());
