import { Button } from '@/components/ui/button/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/card/Card'
import { Label } from '@/components/ui/label/Label'
import RangeInput from '@/components/ui/range-input/RangeInput'
import { TagSelectInput } from '@/components/ui/tag-select-input/TagSelectInput'
import { useFormState } from '@/hooks/useFormState'
import {
  GAME_LEGACY_PLATFORMS,
  GAME_MODERN_PLATFORMS,
} from '@/lib/constants/game-platforms'
import { GENRES } from '@/lib/constants/genres'

export type FilterFormData = {
  platforms: (string | number | object)[]
  genres: (string | number | object)[]
  userScore: number[]
  criticScore: number[]
}

type FilterCardProps = {
  onRollClick: (data: FilterFormData) => void
}

export function FilterCard({ onRollClick }: FilterCardProps) {
  const { form, setField, reset } = useFormState<FilterFormData>({
    platforms: [],
    genres: [],
    userScore: [0, 10],
    criticScore: [0, 10],
  })

  return (
    <Card className="max-w-2xl w-[100%] p-6 bg-black/92">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-center mb-4">
          Random Game Generator
        </h1>
      </CardHeader>
      <CardBody className="p-0">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="tag">Platform</Label>
            <TagSelectInput
              id="tag"
              placeholder="Select platforms..."
              options={[
                { label: 'Modern', options: [...GAME_MODERN_PLATFORMS] },
                { label: 'Legacy', options: [...GAME_LEGACY_PLATFORMS] },
              ]}
              value={form.platforms}
              onChange={(v) => setField('platforms', v)}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="tag">Genres</Label>
            <TagSelectInput
              id="tag"
              placeholder="Select Genres..."
              options={[...GENRES]}
              value={form.genres}
              onChange={(v) => setField('genres', v)}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label>User Score</Label>
            <RangeInput
              marks={{ 0: '0', 5: '5', 10: '10' }}
              value={form.userScore}
              step={0.1}
              onChange={(v) => setField('userScore', v)}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label>Critics Score</Label>
            <RangeInput
              marks={{ 0: '0', 5: '5', 10: '10' }}
              value={form.criticScore}
              step={0.1}
              onChange={(v) => setField('criticScore', v)}
            />
          </div>
          <div className="col-span-12 flex align-middle justify-center pt-6">
            <Button
              onClick={() => onRollClick(form)}
              className="px-10"
              variant="primary"
              size="sm"
            >
              Roll for game
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
