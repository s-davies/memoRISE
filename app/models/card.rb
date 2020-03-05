class Card < ApplicationRecord
    validates :order, presence: true

    belongs_to :deck,
        foreign_key: :deck_id,
        class_name: :Deck
end
