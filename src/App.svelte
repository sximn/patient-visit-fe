<script lang="ts">
  import "./app.css";
  import "./wc/web-components";
</script>

<main class="size-full min-h-screen bg-amber-100">
  <h2>Custom element:</h2>

  <sukus-patient-visit-documentation-app
    basePath="/"
    apiBase="http://localhost:8080/api"
  ></sukus-patient-visit-documentation-app>
</main>
