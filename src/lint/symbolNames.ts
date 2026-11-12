import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

/** The names a top-level statement adds to its module's scope or exports. */
export function symbolNames(
    statement: TSESTree.ProgramStatement | TSESTree.NamedExportDeclarations,
): string[] {
    switch (statement.type) {
        case AST_NODE_TYPES.ExportNamedDeclaration:
            return statement.declaration
                ? symbolNames(statement.declaration)
                : statement.specifiers.map(({ exported }) =>
                      exported.type === AST_NODE_TYPES.Identifier
                          ? exported.name
                          : exported.value,
                  );
        case AST_NODE_TYPES.ExportDefaultDeclaration: {
            const { declaration } = statement;
            if (declaration.type === AST_NODE_TYPES.Identifier) {
                return [declaration.name];
            }
            return (declaration.type === AST_NODE_TYPES.FunctionDeclaration ||
                declaration.type === AST_NODE_TYPES.ClassDeclaration) &&
                declaration.id
                ? [declaration.id.name]
                : ['default'];
        }
        case AST_NODE_TYPES.ExportAllDeclaration:
            return [statement.exported?.name ?? '*'];
        case AST_NODE_TYPES.VariableDeclaration:
            return statement.declarations.flatMap(({ id }) =>
                id.type === AST_NODE_TYPES.Identifier ? [id.name] : [],
            );
        case AST_NODE_TYPES.FunctionDeclaration:
        case AST_NODE_TYPES.TSDeclareFunction:
        case AST_NODE_TYPES.ClassDeclaration:
        case AST_NODE_TYPES.TSInterfaceDeclaration:
        case AST_NODE_TYPES.TSTypeAliasDeclaration:
        case AST_NODE_TYPES.TSEnumDeclaration:
            return statement.id ? [statement.id.name] : [];
        default:
            return [];
    }
}
