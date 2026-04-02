export const PermissionAdmin  = "ADMIN"

//Permisões de usuario
export const PermissionUserCreate  = "user:create"
export const PermissionUserUpdate  = "user:update"
export const PermissionUserDelete  = "user:delete"
export const PermissionUserList  = "user:list"


export const PermissionProductCreate  = "product:create"
export const PermissionProductUpdate  = "product:update"
export const PermissionProductDelete  = "product:delete"
export const PermissionProductList  = "product:list"

export const AllPermissions = [
    //Permisões de usuario
    {tipo : PermissionUserCreate, descricao: "Criar usuário", userId: null},
    {tipo : PermissionUserUpdate, descricao: "Atualizar usuário", userId: null},
    {tipo : PermissionUserDelete, descricao: "Deletar usuário", userId: null},
    {tipo : PermissionUserList, descricao: "Listar usuários", userId: null},
    
    //Permisões de produto
    {tipo : PermissionProductCreate, descricao: "Criar produto", userId: null},
    {tipo : PermissionProductUpdate, descricao: "Atualizar produto", userId: null},
    {tipo : PermissionProductDelete, descricao: "Deletar produto", userId: null},
    {tipo : PermissionProductList, descricao: "Listar produtos", userId: null}

]