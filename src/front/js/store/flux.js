const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			user: [],
			favorites: [],
			activities: []
		},
		actions: {
			getSessionStorage: () => {
				const token = sessionStorage.getItem("token");
				if (token && token != "" && token != undefined) setStore({ token: token });
			},

			// >>>>>> LOGIN/LOGOUT/REGISTER MOISES

			Login: async (email, password) => {
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password
					})
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, opts);
					if (resp.status != 200) {
						alert("Email o contraseña inválidos");
						return false;
					}
					const data = await resp.json();
					sessionStorage.setItem("token", data.access_token);
					console.log(">>>>LOGIN TOKEN: ", data.access_token);
					console.log(">>>>LOGIN USER: ", data.user);
					console.log(">>>>LOGIN FAVORITES: ", data.user.favorites);
					console.log(">>>>LOGIN ACTIVITIES: ", data.user.activities);
					setStore({
						token: data.access_token,
						user: data.user,
						favorites: data.favorites,
						activities: data.activities
					});
					return true;
				} catch (err) {
					console.error(">>>LOGIN ERROR", err);
				}
			},
			Logout: () => {
				sessionStorage.removeItem("token");
				setStore({
					token: null,
					user: [],
					favorites: [],
					activities: []
				});
			},
			Register: async (name, last_name, email, password) => {
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						name: name,
						last_name: last_name,
						email: email,
						password: password
					})
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/register`, opts);
					if (resp.status != 200) {
						return false;
					}
					const data = await resp.json();
					console.log(">>>>REGISTER DATA: ", data);
					return true;
				} catch (err) {
					console.error(">>>REGISTER ERROR", err);
				}
			},

			// >>>>>>> ADD/DELETE FAVORITES MOISES

			addFavorite: async (title, description, link, user_id) => {
				const store = getStore();
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token
					},
					body: JSON.stringify({
						title: title,
						description: description,
						link: link,
						user_id: user_id
					})
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/favorite`, opts);
					if (resp.status != 200) {
						alert("ADD FAVORITE ERROR");
					}
					const data = await resp.json();
					setStore({ favorites: [...store.favorites, data.favorite] });
					console.log(">>>>ADDFAVORITE", store.favorites);
				} catch (err) {
					console.error(">>>ADD FAVORITE ERROR", err);
				}
			},
			deleteFavorite: async id => {
				const store = getStore();
				const opts = {
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + store.token
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/favorite/${id}`, opts);
					if (resp.status != 200) {
						alert("DELETE FAVORITE ERROR");
					}
					const filter = store.favorites.filter(item => item.id != id);
					setStore({ favorites: filter });
					console.log(">>>>DELETEFAVORITE ", store.favorites);
				} catch (err) {
					console.error(">>>DELETE FAVORITE ERROR", err);
				}
			},

			// >>>>>>> ADD/DELETE ACTIVITIES MOISES

			addActivity: async (exercise, distance, date, lapse, user_id) => {
				const store = getStore();
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + store.token
					},
					body: JSON.stringify({
						exercise: exercise,
						distance: distance,
						date: date,
						lapse: lapse,
						user_id: user_id
					})
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/activity`, opts);
					if (resp.status != 200) {
						alert("ADD ACTIVITY ERROR");
					}
					const data = await resp.json();
					setStore({ activities: [...store.activities, data.activity] });
					console.log(">>>>ADDACTIVITY", store.activities);
				} catch (err) {
					console.error(">>>ADD ACTIVITY ERROR", err);
				}
			},
			deleteActivity: async id => {
				const store = getStore();
				const opts = {
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + store.token
					}
				};
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/activity/${id}`, opts);
					if (resp.status != 200) {
						alert("DELETE ACTIVITY ERROR");
					}
					const filter = store.activities.filter(item => item.id != id);
					setStore({ activities: filter });
					console.log(">>>>DELETEACTIVITY ", store.activities);
				} catch (err) {
					console.error(">>>DELETE ACTIVITY ERROR", err);
				}
			}

			// ↓↓↓ ADD MORE ACTIONS HERE ↓↓↓ (IF NEEDED)
		}
	};
};

export default getState;
