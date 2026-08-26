import { useSermons } from '../../hooks/useSermons';
import VideoEmbed from '../../components/media/videoEmbed';
import { formatShortDate } from '../../utils/dateHelpers';

export default function MemberSermonsPage() {
  const { sermons, loading } = useSermons();

  return (
    <div>
      <div>
        <h1>Sermons</h1>
      </div>

      {loading ? (
        <p>Loading sermons...</p>
      ) : sermons.length === 0 ? (
        <p>No sermons found.</p>
      ) : (
        <div>
          {sermons.map((s) => (
            <div key={s.id}>
              <VideoEmbed url={s.media_url} />
              <div>
                <h3>{s.title}</h3>
                {s.speaker && <p>{s.speaker}</p>}
                <p>{formatShortDate(s.date_preached ?? '')}</p>
                {(s.tags ?? []).length > 0 && (
                  <div>
                    {s.tags!.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}