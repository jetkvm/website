import { redirect } from "@remix-run/node";

export function loader() {
  return redirect(
    "https://drive.google.com/drive/folders/1KGj4tcjIwXfV0Phuos-WlSZW5At8JnUD?usp=drive_link",
  );
}
