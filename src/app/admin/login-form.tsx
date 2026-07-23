"use client";

import { useActionState } from "react";
import { login } from "./actions";
import "./admin.css";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {
    error: "",
  });

  return (
    <div className="admin">
      <form className="admin-login" action={action}>
        <div className="admin-title">[GODHANDUSA ADMIN]</div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
        />
        {state.error && <div className="admin-error">{state.error}</div>}
        <button type="submit" disabled={pending}>
          Enter
        </button>
      </form>
    </div>
  );
}
