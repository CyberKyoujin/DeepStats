"""add trade and portfolio tables

Revision ID: 7c9dcac77f72
Revises: e25f5c2c5617
Create Date: 2026-04-10 17:05:48.249193

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c9dcac77f72'
down_revision: Union[str, Sequence[str], None] = 'e25f5c2c5617'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('trade') as batch_op:
        batch_op.create_unique_constraint('uq_trade_position_id', ['position_id'])


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('trade') as batch_op:
        batch_op.drop_constraint('uq_trade_position_id', type_='unique')
