// // components/ProtectedRoute.js
// import { useSession, signIn } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';

// export default function ProtectedRoute({ children, role }) {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === 'loading') return; // Do nothing while loading
//     if (!session) signIn(); // Redirect to sign-in if not authenticated
//     if (session && session.user.role !== role) router.push('/'); // Redirect if role doesn't match
//   }, [session, status]);

//   if (status === 'loading' || !session || session.user.role !== role) {
//     return <div>Loading...</div>;
//   }

//   return children;
// }
