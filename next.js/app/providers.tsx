'use client';
import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client/react";
import { PropsWithChildren, useState } from "react";
import { store } from "../store";
import { apolloClient } from "../lib/apolloClient";
import { SessionProvider } from "../context/SessionContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: PropsWithChildren) {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: 1,
			},
		},
	}));

	return (
		<QueryClientProvider client={queryClient}>
			<ReduxProvider store={store}>
				<ApolloProvider client={apolloClient}>
					<SessionProvider>{children}</SessionProvider>
				</ApolloProvider>
			</ReduxProvider>
		</QueryClientProvider>
	);
}


