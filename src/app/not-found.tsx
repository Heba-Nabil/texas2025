// "use client";

import { redirect } from "next/navigation";

// import { useEffect } from "react";
// import Error from "next/error";
// import { useRouter } from "next/navigation";

// // Render the default Next.js 404 page when a route
// // is requested that doesn't match the middleware and
// // therefore doesn't have a locale associated with it.

// export default function NotFound() {
//   const router = useRouter();

//   useEffect(() => {
//     router.refresh();
//   }, [router]);

//   return (
//     <html lang="en" dir="ltr">
//       <body>
//         <Error statusCode={404} />
//       </body>
//     </html>
//   );
// }

export default function MainNotFound() {
  return redirect("/");
}
