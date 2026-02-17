export const PermissionAdmin  = "ADMIN"

//Permisões de usuario
export const PermissionUserCreate  = "user:create"
export const PermissionUserUpdate  = "user:update"
export const PermissionUserDelete  = "user:delete"
export const PermissionUserList  = "user:list"

export const AllPermissions = [
    //Permisões de usuario
    {tipo : PermissionUserCreate, descricao: "Criar usuário", userId: null},
    {tipo : PermissionUserUpdate, descricao: "Atualizar usuário", userId: null},
    {tipo : PermissionUserDelete, descricao: "Deletar usuário", userId: null},
    {tipo : PermissionUserList, descricao: "Listar usuários", userId: null},
    
]