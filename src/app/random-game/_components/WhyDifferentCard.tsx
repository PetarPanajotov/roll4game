import { Card, CardBody, CardHeader } from '@/components/ui/card/Card'

export function WhyDifferentCard() {
  return (
    <Card className="m-12 p-5">
      <CardHeader>
        <h4 className="text-2xl">Why This Generator is Different?</h4>
      </CardHeader>
      <CardBody>
        <p>
          Most random game pickers act as "popularity filters." They often skip
          over 90% of the games in their database by default because they only
          search for titles with existing high ratings or a minimum number of
          reviews. This tool was built to change that. By leveraging the full
          power of the IGDB API, this generator allows you to explore the entire
          history of gaming — without hidden gatekeeping.
        </p>
        <ul className="list-disc ps-5 pt-5 flex flex-col gap-3">
          <li>
            <span className="font-bold">Zero Popularity Bias:</span> The pool
            isn't limited to "verified hits." You have access to the complete
            IGDB archive, ensuring a truly random discovery experience that
            includes the thousands of titles other sites simply filter out.
          </li>
          <li>
            <span className="font-bold">Access to 400,000+ Games:</span> Unlike
            other tools that only cycle through the "Top 100" or mainstream
            hits, this generator gives every game an equal chance. You are just
            as likely to find a forgotten 80s arcade classic or a brand-new
            indie project as you are a AAA blockbuster.
          </li>
          <li>
            <span className="font-bold">The "Unrated" Advantage:</span> Many of
            the most unique gaming experiences don't have enough reviews for a
            score yet. While other sites hide these by default, this tool lets
            you discover games regardless of their review count. By setting your
            rating filter to 0, you open the door to a massive world of hidden
            gems that have yet to be discovered by the mainstream.
          </li>
          <li>
            <span className="font-bold">Granular Discovery Control:</span> This
            isn't just a shuffler; it’s a precision discovery engine. You have
            the power to layer your search—combining specific genres and
            platforms—while deciding for yourself if you want to see only the
            highest-rated masterpieces or dive into the vast, unfiltered sea of
            gaming history where scores don't define the experience.
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}
