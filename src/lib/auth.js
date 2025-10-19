export function getUser() {
    try { return JSON.parse(localStorage.getItem("zamanUser") || "null"); }
    catch { return null; }
  }
  export function setUser(user) {
    localStorage.setItem("zamanUser", JSON.stringify(user));
  }
  export function clearUser() {
    localStorage.removeItem("zamanUser");
  }
  export function isAuthed() {
    return !!getUser();
  }