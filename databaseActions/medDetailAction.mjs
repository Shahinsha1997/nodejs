

import { getMedManagementAcc } from "../utils/dbUtils.mjs";

export const createDatabase = async (id)=>{
    const medManagementDb = await getMedManagementAcc();
    await medManagementDb.databases.create(id, {
        group: "default",
    });
}

export const createDBToken = async ()=>{
    const medManagementDb = await getMedManagementAcc();
    const authToken = await medManagementDb.databases.createToken("my-db", {
        expiration: "2w",
        authorization: "full-access",
    });
}