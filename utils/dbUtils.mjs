
import { createClient } from "@tursodatabase/api";
import { createClient as createDBClient } from "@libsql/client";

export const getUserManagementAcc = async ()=> createClient({
    org: 'shahinsha',
    token:'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18yYzA4R3ZNeEhYMlNCc3l0d2padm95cEdJeDUiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MjE3NDMyNzcsImlhdCI6MTcyMTEzODQ3NywiaXNzIjoiaHR0cHM6Ly9jbGVyay50dXJzby50ZWNoIiwianRpIjoiY2Y1ZTk4OWJmMThiMjYwNTdhZjQiLCJuYmYiOjE3MjExMzg0NzIsInN1YiI6InVzZXJfMmpLWnpFS0tvc29wTmhnNnFKbklISzBkUjdjIn0.gOeaw5kMMSKcIsXEuQzoMKpFH5t0QzIT--XvxMJQeHx2Q8QhIrfFxHrabE4rbbXUY7AeA14pO_NAKk-HHZJqtc5zYU6p0sKOqmVGo8RA2LRt305RsDY1H-7nIjjPhJ8QST0MPLRmCpD9_EoDgo3uJ7EySDozQnsJ2sFYDapA5XZBFi-wHhQVStomahOFCvQrSmR9_mcml5Hf2PhfdX72SRqphy3HZnDHR5KLEDT0gF7DvXdwD2xDj_pqA5TiFdXZWZZmysHeAut9mqJ0fhGNVVLgsVRDUy5RWjgbrcAc5E8oRu7ZW7dWU-QFMsqnrcxpBS7XMeOkKToQyZ0S8HzeOg'
});

export const getUserManagementDB = async ()=> createDBClient({
    url:"libsql://usermanagement-shahinsha.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjEyMDE2NzYsImlkIjoiYzUzODZlMGYtY2RjMi00NWU5LWJlMTktNzhjZTgwZGY3MzQ4In0.ko7nTqbhf0atYAuTDQlPO0hEIDnvlckIw94m76zzoL6roy8vJoX4b6zg6JfzCNswJ8pOu6j447Uanv8-Kz6KCA"
})

export const getMedManagementAcc = async ()=> createClient({
    org: "shahinsha1997",
    token: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzQXRFeWtIR0VlLUowUUpVMUpPR1JBIn0.pMmnBa9LbUDSTUtY9xtP0pPTDKvw25_HJTfpA8GTVnOtpM5vVXMwijBQ9x6dZr-naXJx--v8XS0A00cxpNd_BA",
})

export const medDBURL = (DB)=> `libsql://${DB}-shahinsha1997.turso.io`;
