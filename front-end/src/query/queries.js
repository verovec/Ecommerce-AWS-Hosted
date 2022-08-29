import { apiRequest } from "./utils";

export const queries = {
    auth: {
        useLogin: {
            query: async ({
                email,
                password,
            }) => await apiRequest({ path: "/auth/signin", method: "POST", body: { email, password } }),
            key: "useLoginByCredentials",
        },
        useRegister: {
            query: async ({
                name,
                password,
                birthDate,
                email,
            }) => await apiRequest({ path: "/auth/signup", method: "POST", body: { name, password, birthDate, email } }),
            key: "useRegisterByCredentials",
        },
        useDisableAccount: {
            query: async ({ token }) => await apiRequest({ token, path: "/users/me/disable", method: "PUT" }),
            key: "useDisableAccount",
        },
        useEnableAccountById: {
            query: async ({ token, userId }) => await apiRequest({ token, path: "/users/" + userId + "/enable", method: "PUT" }),
            key: "useEnableAccountById",
        },
        useDisableAccountById: {
            query: async ({ token, userId }) => await apiRequest({ token, path: "/users/" + userId + "/disable", method: "PUT" }),
            key: "useDisableAccountById",
        },
    },
    user: {
        useUser: {
            query: async (token) =>
                await apiRequest({ token, path: "/users/me", method: "GET" }),
            key: "getUser",
        },
        useUserById: {
            query: async (token, userId) =>
                await apiRequest({ token, path: "/users/" + userId, method: "GET" }),
            key: "getUserById",
        },
        useUsers: {
            query: async (token) =>
                await apiRequest({ token, path: "/users", method: "GET" }),
            key: "getUsers",
        },
        useCart: {
            query: async ({ params, token }) =>
                await apiRequest({ token, path: `/users/me/cart${params ? params : ''}`, method: "GET" }),
            key: "getUserCart",
        },
        useAddProductCart: {
            query: async ({ idProduct, quantity, token }) =>
                await apiRequest({ token, path: `/users/me/cart/products/${idProduct}`, method: "PUT", body: { quantity: quantity } }),
            key: "putAddCart",
        },
        useDeleteProductCart: {
            query: async ({ idProduct, token }) =>
                await apiRequest({ token, path: `/users/me/cart/products/${idProduct}`, method: "DELETE", body: {}}),
            key: "delDeleteCart",
        },
        useWish: {
            query: async ({ params, token }) =>
                await apiRequest({ token, path: `/users/me/wishlist${params ? params : ''}`, method: "GET" }),
            key: "getUserWish",
        },
        useAddProductWish: {
            query: async ({ idProduct, quantity, token }) =>
                await apiRequest({ token, path: `/users/me/whishlist/products/${idProduct}`, method: "PUT", body: { quantity: quantity } }),
            key: "putAddWish",
        },
        useDeleteProductWish: {
            query: async ({ idProduct, token }) =>
                await apiRequest({ token, path: `/users/me/wishlist/products/${idProduct}`, method: "DELETE", body: {}}),
            key: "delDeleteWish",
        },
    },
    orders: {
        useCreateOrder: {
            query: async ({ addressId, token }) =>
                await apiRequest({ token, path: `/orders`, method: "POST", body: { addressId } }),
            key: "createOrder",
        },
        useGetOrders: {
            query: async ({ token, userId }) =>
                await apiRequest({ token, path: `/users/${userId}/orders`, method: "GET" }),
            key: "getOrders",
        },
        useGetSellerOrders: {
            query: async ({ token, userId }) =>
                await apiRequest({ token, path: `/users/${userId}/seller/orders`, method: "GET" }),
            key: "getSellerOrders",
        },
    },
    product: {
        useProducts: {
            query: async ({ params }) =>
                await apiRequest({ path: `/products?limit=10${params}`, method: "GET" }),
            key: "getProducts",
        },
        useProduct: {
            query: async ({ idProduct }) =>
                await apiRequest({ path: `/products/${idProduct}`, method: "GET" }),
            key: "getProduct",
        },
        useDispatchProduct: {
            query: async ({ token, idOrder, idProduct }) =>
                await apiRequest({ token, path: `/orders/${idOrder}/products/${idProduct}/dispatch`, method: "PUT" }),
            key: "dispatchProduct",
        },
        useUpdateProduct: {
            query: async ({ token, idProduct, price, name, categories, tags, quantity, description, state }) =>
                await apiRequest({ token, path: `/products/${idProduct}`, method: "PUT", body: { quantity, state, description, price: price, name: name, categories: categories, tags: tags } }),
            key: "updateProduct",
        },
        useDeleteProduct: {
            query: async ({ idProduct, token }) =>
                await apiRequest({ token, path: `/products/${idProduct}`, method: "DELETE" }),
            key: "deleteProduct",
        },
        useCreateProduct: {
            query: async (
                {
                    token,
                    description,
                    price,
                    name,
                    mark,
                    categories,
                    tags,
                    quantity
                }) => await apiRequest({ token, path: `/products`, method: "POST", body: { description, price, name, mark, categories, quantity, tags } }),
            key: "createProduct",
        },
        useOrdersProduct: {
            query: async ({ idProduct, token }) =>
                await apiRequest({ token, path: `/products/${idProduct}/orders`, method: "GET" }),
            key: "getOrdersProduct",
        }
    },
    address: {
        useAddresses:{
            query: async ({ token, params }) =>
                await apiRequest({ token, path: `/users/me/addresses${params}`, method: "GET"}),
            key: "getAddresses",
        },
        useAddressesById:{
            query: async ({ token, params, userId }) =>
                await apiRequest({ token, path: `/users/${userId}/addresses${params}`, method: "GET"}),
            key: "getAddressesById",
        },
        useAddress:{
            query: async ({ token, idAddress }) =>
                await apiRequest({ token, path: `/users/me/addresses/${idAddress}`, method: "GET"}),
            key: "getAddress",
        },
        useAddAddress: {
            query: async ({ token, params }) =>
                await apiRequest({ token, path: `/users/me/addresses`, method: "POST", body: { ...params }}),
            key: "addAddress",
        },
        useRemoveAddress: {
            query: async ({ token, addressId }) =>
                await apiRequest({ token, path: `/users/me/addresses/${addressId}`, method: "DELETE" }),
            key: "removeAddress",
        }
    },
    filter: {
        useCategories:{
            query: async () =>
                await apiRequest({ path: `/categories`, method: "GET"}),
            key: "getCategories",
        },
    },
    rating: {
        useRating:{
            query: async ({idProduct}) =>
                await apiRequest({ path: `/products/${idProduct}/ratings`, method: "GET"}),
            key: "getRating",
        },
        useCreateRating:{
            query: async ({token, idProduct, message, count}) =>
                await apiRequest({ token, path: `/products/${idProduct}/ratings`, method: "POST", body: { message, count } }),
            key: "createRating",
        }
    },

}
