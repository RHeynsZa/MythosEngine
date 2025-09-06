"""Add users table and article visibility

Revision ID: add_users_visibility
Revises: d42a4bc96954
Create Date: 2025-09-05 21:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'add_users_visibility'
down_revision: Union[str, None] = 'd42a4bc96954'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create articlevisibility enum
    article_visibility_enum = postgresql.ENUM('unlisted', 'private', 'public', name='articlevisibility')
    article_visibility_enum.create(op.get_bind())
    
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('display_name', sa.String(), nullable=False),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('avatar_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    
    # Add owner_id to projects table
    op.add_column('projects', sa.Column('owner_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_projects_owner_id', 'projects', 'users', ['owner_id'], ['id'])
    
    # Add author_id and visibility to articles table
    op.add_column('articles', sa.Column('author_id', sa.Integer(), nullable=True))
    op.add_column('articles', sa.Column('visibility', article_visibility_enum, nullable=True))
    op.create_foreign_key('fk_articles_author_id', 'articles', 'users', ['author_id'], ['id'])
    op.create_index(op.f('ix_articles_visibility'), 'articles', ['visibility'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Remove indices and foreign keys
    op.drop_index(op.f('ix_articles_visibility'), table_name='articles')
    op.drop_constraint('fk_articles_author_id', 'articles', type_='foreignkey')
    op.drop_constraint('fk_projects_owner_id', 'projects', type_='foreignkey')
    
    # Remove columns
    op.drop_column('articles', 'visibility')
    op.drop_column('articles', 'author_id')
    op.drop_column('projects', 'owner_id')
    
    # Drop users table
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    
    # Drop enum
    article_visibility_enum = postgresql.ENUM('unlisted', 'private', 'public', name='articlevisibility')
    article_visibility_enum.drop(op.get_bind())