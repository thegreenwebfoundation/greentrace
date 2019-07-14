<template>
  <div id="wrapper">
    <main>
      <arc-map></arc-map>
    </main>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import ArcMap from "./LandingPage/ArcMap";

export default {
  name: "landing-page",
  components: { SystemInformation, ArcMap },
  methods: {}
};
</script>

<style>
</style>
